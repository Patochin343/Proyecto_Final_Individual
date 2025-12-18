import http.server
import socketserver
import webbrowser
import os

# CONFIGURACIÓN
PORT = 8000
# Esta clase sirve los archivos estáticos (HTML, CSS, JS) automáticamente
Handler = http.server.SimpleHTTPRequestHandler

# Para evitar problemas si se reinicia rápido el server (Address already in use)
socketserver.TCPServer.allow_reuse_address = True

# INICIAMOS EL SERVIDOR
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    url = f"http://localhost:{PORT}"
    
    print(f"--- SERVIDOR LOCAL ACTIVO ---")
    print(f"Sirviendo archivos desde: {os.getcwd()}")
    print(f"Entra a: {url}")
    print("Presiona Ctrl+C para detenerlo.")

    # Esto intentará abrir tu navegador automáticamente
    try:
        webbrowser.open(url)
    except:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n--- Servidor detenido ---")