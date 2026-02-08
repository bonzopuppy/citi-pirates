/**
 * Parent email addresses — SERVER-SIDE ONLY.
 *
 * This file must NEVER be imported in client components or pages
 * that pass data to client components. It contains PII for
 * parents of minor children.
 */

const PARENT_EMAILS: Record<string, string> = {
  'aaron-cheng': 'ciaoirene@hotmail.com',
  'anderson-berning': 'amywlin@gmail.com',
  'christopher-justen': 'diane.chui@gmail.com',
  'damon-jung': 'rahsalee@gmail.com',
  'garo-balabanian': 'kriscowan@gmail.com',
  'gavin-wu': 'deannayick@gmail.com',
  'jackson-evans': 'gwenkalyanapu@hotmail.com',
  'joe-clemenson': 'lolitaclemenson@gmail.com',
  'samuel-zottarelli': 'meganzottarelli@gmail.com',
  'sawyer-lurie': 'beccaprowda@gmail.com',
  'xander-macdonald': 'aml169@yahoo.com',
  'zach-baden': 'afox@olive-events.com',
};

export function getParentEmail(playerId: string): string | undefined {
  return PARENT_EMAILS[playerId];
}

export function getAllParentEmails(): Record<string, string> {
  return { ...PARENT_EMAILS };
}
