import { Resend } from 'resend';

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(process.env.RESEND_API_KEY);
}

/* ------------------------------------------------------------------ */
/*  Logo URL                                                           */
/* ------------------------------------------------------------------ */

const LOGO_URL = 'https://www.gocitipirates.com/images/citi-pirates-logo.png';

/* ------------------------------------------------------------------ */
/*  Stat category labels (mirrored from DingAThonForm)                 */
/* ------------------------------------------------------------------ */

const STAT_LABELS: Record<string, string> = {
  singles: 'Singles',
  doubles: 'Doubles',
  triples: 'Triples',
  homeRuns: 'Home Runs',
  runsScored: 'Runs Scored',
  rbis: 'RBIs',
  stolenBases: 'Stolen Bases',
  strikeouts: 'Strikeouts',
  defensiveOuts: 'Defensive Outs',
  infieldAssists: 'Infield Assists',
  outfieldAssists: 'Outfield Assists',
  doublePlays: 'Double Plays',
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PledgeEmailData {
  parentEmail: string;
  playerFirstName: string;
  playerLastName: string;
  playerJerseyNumber: number;
  supporterName: string;
  supporterEmail: string;
  supporterPhone: string;
  pledges: Record<string, number>;
  cap: number | null;
  estimatedTotal: number;
}

/* ------------------------------------------------------------------ */
/*  Shared email building blocks                                       */
/* ------------------------------------------------------------------ */

function buildPledgeRows(pledges: Record<string, number>): string {
  return Object.entries(pledges)
    .filter(([, amt]) => amt > 0)
    .map(
      ([key, amt]) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#333;">${STAT_LABELS[key] || key}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;color:#333;font-weight:600;">$${amt.toFixed(2)}</td>
        </tr>`
    )
    .join('');
}

function buildEmailShell(subtitle: string, bodyHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">

    <!-- Header -->
    <div style="background:#1a1a1a;padding:24px 32px;text-align:center;">
      <img src="${LOGO_URL}" alt="Citi Pirates" width="180" style="display:block;margin:0 auto 12px;" />
      <p style="margin:0;color:#888;font-size:14px;letter-spacing:1px;">${subtitle}</p>
    </div>

    <!-- Body -->
    <div style="background:#ffffff;padding:32px;">
      ${bodyHtml}
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px;text-align:center;">
      <p style="margin:0;color:#aaa;font-size:12px;">
        Citi Pirates 12U &mdash; Road to Cooperstown 2026
      </p>
    </div>

  </div>
</body>
</html>`;
}

function buildPledgeTable(pledges: Record<string, number>): string {
  return `
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <thead>
          <tr style="background:#f9f9f9;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;color:#888;letter-spacing:1px;">Category</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase;color:#888;letter-spacing:1px;">Per Stat</th>
          </tr>
        </thead>
        <tbody>
          ${buildPledgeRows(pledges)}
        </tbody>
      </table>`;
}

function buildEstimatedTotal(estimatedTotal: number, cap: number | null): string {
  const capLine = cap
    ? `<p style="color:#888;font-size:14px;margin:4px 0 0;">Donation cap: <strong>$${cap.toFixed(2)}</strong></p>`
    : '';

  return `
      <div style="background:#1a1a1a;padding:20px;text-align:center;margin:20px 0;">
        <p style="margin:0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Estimated Season Total</p>
        <p style="margin:8px 0 0;font-size:32px;font-weight:700;color:#CC0000;">
          ${estimatedTotal > 0 ? `$${estimatedTotal.toFixed(2)}` : 'TBD'}
        </p>
        ${capLine}
      </div>`;
}

/* ------------------------------------------------------------------ */
/*  Parent notification email                                          */
/* ------------------------------------------------------------------ */

function buildParentEmailHtml(data: PledgeEmailData): string {
  const body = `
      <p style="font-size:16px;color:#333;margin:0 0 16px;">
        Great news! <strong>${data.supporterName}</strong> just made a Ding-A-Thon pledge for
        <strong>${data.playerFirstName} ${data.playerLastName} (#${data.playerJerseyNumber})</strong>.
      </p>

      ${buildPledgeTable(data.pledges)}
      ${buildEstimatedTotal(data.estimatedTotal, data.cap)}

      <!-- Supporter info -->
      <div style="background:#f9f9f9;padding:16px 20px;margin:20px 0;">
        <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;color:#888;letter-spacing:1px;">Supporter Contact</p>
        <p style="margin:0;color:#333;font-size:14px;">
          <strong>${data.supporterName}</strong><br />
          ${data.supporterEmail}<br />
          ${data.supporterPhone}
        </p>
      </div>

      <p style="font-size:14px;color:#888;margin:20px 0 0;">
        The final donation amount will be based on ${data.playerFirstName}'s actual game stats during the 2026 spring season.
      </p>`;

  return buildEmailShell('DING-A-THON PLEDGE', body);
}

/* ------------------------------------------------------------------ */
/*  Supporter confirmation email                                       */
/* ------------------------------------------------------------------ */

function buildSupporterEmailHtml(data: PledgeEmailData): string {
  const body = `
      <p style="font-size:16px;color:#333;margin:0 0 4px;">
        Thank you for your pledge, <strong>${data.supporterName}</strong>!
      </p>
      <p style="font-size:15px;color:#555;margin:0 0 16px;">
        Your Ding-A-Thon pledge for
        <strong style="color:#333;">${data.playerFirstName} ${data.playerLastName} (#${data.playerJerseyNumber})</strong>
        has been received. Here's a summary:
      </p>

      ${buildPledgeTable(data.pledges)}
      ${buildEstimatedTotal(data.estimatedTotal, data.cap)}

      <p style="font-size:14px;color:#888;margin:20px 0 0;">
        The final donation amount will be based on ${data.playerFirstName}'s actual game stats during the 2026 spring season.
        We'll be in touch when the season wraps up. Go Pirates!
      </p>`;

  return buildEmailShell('PLEDGE CONFIRMATION', body);
}

/* ------------------------------------------------------------------ */
/*  Send pledge notification email (to parent)                         */
/* ------------------------------------------------------------------ */

export async function sendPledgeNotification(data: PledgeEmailData) {
  const html = buildParentEmailHtml(data);

  const { error } = await getResend().emails.send({
    from: 'Citi Pirates Ding-A-Thon <noreply@gocitipirates.com>',
    to: data.parentEmail,
    subject: `New Ding-A-Thon Pledge for ${data.playerFirstName} ${data.playerLastName}!`,
    html,
  });

  if (error) {
    console.error('Resend email error (parent):', error);
    throw new Error(`Failed to send parent email: ${error.message}`);
  }
}

/* ------------------------------------------------------------------ */
/*  Send pledge confirmation email (to supporter)                      */
/* ------------------------------------------------------------------ */

export async function sendSupporterConfirmation(data: PledgeEmailData) {
  const html = buildSupporterEmailHtml(data);

  const { error } = await getResend().emails.send({
    from: 'Citi Pirates Ding-A-Thon <noreply@gocitipirates.com>',
    to: data.supporterEmail,
    subject: `Thanks for Your Ding-A-Thon Pledge for ${data.playerFirstName}!`,
    html,
  });

  if (error) {
    console.error('Resend email error (supporter):', error);
    throw new Error(`Failed to send supporter email: ${error.message}`);
  }
}
