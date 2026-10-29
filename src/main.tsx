import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';

import './styles/globals.css';

// index.html keeps a static <title> for clients that never run this script — link-preview
// scrapers among them. React 19 hoists each page's <title> from <Seo> but never removes one it
// did not create, so without this the rendered head carries two. An inline script in index.html
// would do it earlier, but script-src 'self' in customHttp.yml blocks inline script.
document.querySelector('head > title')?.remove();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
