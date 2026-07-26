import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// State pour gérer les envois en cours
const sendQueue = {
  active: false,
  paused: false,
  recipients: [],
  currentIndex: 0,
  sent: 0,
  failed: 0,
  logs: [],
  config: null
};

// ────────────────────────────────────────────────────────────────────────
// API ENDPOINTS
// ────────────────────────────────────────────────────────────────────────

// Test de connexion Resend
app.post('/api/resend/test', async (req, res) => {
  try {
    const { apiKey, fromEmail, fromName, testEmail } = req.body;

    if (!apiKey) {
      return res.json({ success: false, error: 'Clé API manquante' });
    }

    const response = await axios.post('https://api.resend.com/emails', {
      from: fromName ? `${fromName} <${fromEmail}>` : fromEmail,
      to: testEmail,
      subject: '🧪 Test NeonMail Pro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>✅ Bienvenue sur NeonMail Pro!</h1>
          <p>Cet email teste votre configuration Resend.</p>
          <p><strong>De:</strong> ${fromEmail}</p>
          <p style="color: #00d4ff; margin-top: 20px;">⚡ NeonMail Pro v5</p>
        </div>
      `
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.id) {
      return res.json({ success: true, message: 'Email envoyé', id: response.data.id });
    }

    res.json({ success: false, error: 'Erreur Resend: pas d\'ID retourné' });
  } catch (error) {
    console.error('Test error:', error.message);
    res.json({ 
      success: false, 
      error: error.response?.data?.message || error.message 
    });
  }
});

// Démarrer un envoi
app.post('/api/resend/send', async (req, res) => {
  try {
    const { apiKey, fromEmail, fromName, mail, recipients, delayMs } = req.body;

    if (sendQueue.active) {
      return res.json({ success: false, error: 'Un envoi est déjà en cours' });
    }

    if (!apiKey || !fromEmail || !mail.subject || !recipients.length) {
      return res.json({ success: false, error: 'Configuration incomplète' });
    }

    sendQueue.active = true;
    sendQueue.paused = false;
    sendQueue.recipients = recipients.map(r => ({ ...r, status: 'pending' }));
    sendQueue.currentIndex = 0;
    sendQueue.sent = 0;
    sendQueue.failed = 0;
    sendQueue.logs = [];
    sendQueue.config = { apiKey, fromEmail, fromName, mail, delayMs };

    addLog(`⚡ Envoi démarré — ${recipients.length} destinataires`);
    addLog(`Délai: ${delayMs}ms entre chaque email`);

    // Lance le traitement en arrière-plan
    processSend();

    res.json({ success: true, message: 'Envoi lancé' });
  } catch (error) {
    console.error('Send error:', error);
    res.json({ success: false, error: error.message });
  }
});

// Pause l'envoi
app.post('/api/resend/pause', (req, res) => {
  sendQueue.paused = !sendQueue.paused;
  addLog(sendQueue.paused ? '⏸️ Pause activée' : '▶️ Reprise');
  res.json({ success: true, paused: sendQueue.paused });
});

// Reprendre l'envoi
app.post('/api/resend/resume', (req, res) => {
  if (sendQueue.paused) {
    sendQueue.paused = false;
    addLog('▶️ Reprise');
  }
  res.json({ success: true });
});

// Arrêter l'envoi
app.post('/api/resend/stop', (req, res) => {
  sendQueue.active = false;
  sendQueue.paused = false;
  addLog('🛑 Envoi stoppé');
  res.json({ success: true });
});

// Reset de la queue
app.post('/api/resend/reset', (req, res) => {
  sendQueue.active = false;
  sendQueue.paused = false;
  sendQueue.recipients = [];
  sendQueue.currentIndex = 0;
  sendQueue.sent = 0;
  sendQueue.failed = 0;
  sendQueue.logs = [];
  addLog('↺ Queue réinitialisée');
  res.json({ success: true });
});

// Statut de l'envoi
app.get('/api/resend/status', (req, res) => {
  const since = parseInt(req.query.since || '0');
  const newLogs = sendQueue.logs.slice(since);
  
  let status = 'idle';
  if (sendQueue.active) {
    status = sendQueue.paused ? 'paused' : 'running';
  }
  if (sendQueue.currentIndex >= sendQueue.recipients.length && sendQueue.active) {
    status = 'done';
    sendQueue.active = false;
  }

  res.json({
    status,
    sent: sendQueue.sent,
    failed: sendQueue.failed,
    total: sendQueue.recipients.length,
    currentIndex: sendQueue.currentIndex,
    recipients: sendQueue.recipients,
    newLogs,
    logCount: sendQueue.logs.length
  });
});

// ────────────────────────────────────────────────────────────────────────
// TRAITEMENT BACKEND
// ────────────────────────────────────────────────────────────────────────

async function processSend() {
  while (sendQueue.active && sendQueue.currentIndex < sendQueue.recipients.length) {
    // Pause si demandée
    while (sendQueue.paused && sendQueue.active) {
      await sleep(500);
    }

    if (!sendQueue.active) break;

    const recipient = sendQueue.recipients[sendQueue.currentIndex];
    
    try {
      const body = replacePlaceholders(sendQueue.config.mail.body, recipient);
      
      const response = await axios.post('https://api.resend.com/emails', {
        from: sendQueue.config.fromName 
          ? `${sendQueue.config.fromName} <${sendQueue.config.fromEmail}>`
          : sendQueue.config.fromEmail,
        to: recipient.email,
        subject: sendQueue.config.mail.subject,
        [sendQueue.config.mail.html ? 'html' : 'text']: body
      }, {
        headers: {
          'Authorization': `Bearer ${sendQueue.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.id) {
        recipient.status = 'sent';
        sendQueue.sent++;
        addLog(`✓ ${recipient.email}`);
      } else {
        throw new Error('Pas de réponse valide');
      }
    } catch (error) {
      recipient.status = 'error';
      sendQueue.failed++;
      const msg = error.response?.data?.message || error.message;
      addLog(`✗ ${recipient.email} — ${msg}`, 'error');
    }

    sendQueue.currentIndex++;

    // Délai avant le prochain
    if (sendQueue.currentIndex < sendQueue.recipients.length) {
      await sleep(sendQueue.config.delayMs);
    }
  }

  if (sendQueue.currentIndex >= sendQueue.recipients.length) {
    sendQueue.active = false;
    addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    addLog(`✅ ENVOI TERMINÉ — ${sendQueue.sent} envoyés, ${sendQueue.failed} échoués`);
    addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

function replacePlaceholders(text, recipient) {
  return text
    .replace(/{{email}}/g, recipient.email)
    .replace(/{{name}}/g, recipient.name || recipient.email.split('@')[0])
    .replace(/{{RANDOM}}/g, Math.random().toString(36).substring(2, 8).toUpperCase());
}

function addLog(message, level = 'info') {
  sendQueue.logs.push({
    msg: message,
    level: level,
    time: new Date().toLocaleTimeString()
  });
  console.log(`[${level.toUpperCase()}]`, message);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ────────────────────────────────────────────────────────────────────────
// DÉMARRAGE SERVEUR
// ────────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 NeonMail Pro v5 running on http://localhost:${PORT}`);
  console.log(`📧 API Key: ${RESEND_API_KEY ? '✅ Configured' : '❌ Missing'}`);
});
