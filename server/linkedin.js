import { profile } from '../src/profile.js';
import { linkedinSnapshot } from './approved-sources.js';

export function getLinkedinProfile() {
  const imported = linkedinSnapshot?.text && linkedinSnapshot?.importedAt;
  return {
    status: imported ? 'imported_snapshot' : 'import_pending',
    url: profile.linkedin,
    text: imported ? linkedinSnapshot.text : null,
    importedAt: imported ? linkedinSnapshot.importedAt : null,
    note: imported ? 'Owner-supplied profile snapshot. This is not a live LinkedIn feed.' : 'The LinkedIn profile has not been imported. Use the portfolio for biographical facts and offer the verified LinkedIn link. Do not claim to have read the full LinkedIn profile.',
    cards: [{ type: 'source', id: 'linkedin-profile', kind: 'LinkedIn', title: 'Bharadwaj on LinkedIn', url: profile.linkedin, summary: imported ? 'Imported profile snapshot' : 'View the profile on LinkedIn' }],
  };
}
