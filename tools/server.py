import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from http.server import test as test_server


class MyRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        super().end_headers()


if __name__ == "__main__":
    test_server(
        MyRequestHandler,
        ThreadingHTTPServer,
        port=int(sys.argv[1]) if len(sys.argv) > 1 else 8000,
    )
