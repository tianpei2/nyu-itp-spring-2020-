import os

from flask import Flask
from werkzeug.middleware.http_proxy import ProxyMiddleware
from werkzeug.utils import redirect
from oauth2 import add_token_to_uri, oauth_token_session_key


class FoursquareAPIProxy(ProxyMiddleware):
    def _add_token(self, environ, token):
        qs = '?' + environ['QUERY_STRING']
        environ['QUERY_STRING'] = add_token_to_uri(qs, token)[1:]
        return environ

    def __call__(self, environ, start_response):
        path = environ["PATH_INFO"]
        if not any(path.startswith(prefix) for prefix in self.targets):
            return self.app(environ, start_response)

        token = environ['werkzeug.request'].cookies.get(oauth_token_session_key)
        if not token and environ.get('HTTP_X_REQUESTED_WITH') != 'XMLHttpRequest':
            # TODO: add next to redirect url
            return redirect('/login')(environ, start_response)

        environ = self._add_token(environ, token)
        return super(FoursquareAPIProxy, self).__call__(
            environ, start_response)
