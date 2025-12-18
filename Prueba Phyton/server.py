import http.server
import socketserver
import urllib.parse
import csv
import datetime
import os

# Configuramos un puerto diferente para no chocar con nada
PORT = 8000

class ManejadorSeguro(http.server.SimpleHTTPRequestHandler):
    
    def do_POST(self):
        # 1. Detectamos si alguien envió el formulario a la ruta "/guardar_local"
        if self.path == '/guardar_local':
            
            # A. Leemos el tamaño del mensaje que llega
            content_length = int(self.headers['Content-Length'])
            
            # B. Leemos los datos en bytes
            post_data = self.rfile.read(content_length)
            
            # C. Decodificamos (de bytes raros a texto legible)
            data_str = post_data.decode('utf-8')
            datos = urllib.parse.parse_qs(data_str)
            
            # D. Extraemos la información limpia
            # .get() devuelve una lista, tomamos el primer elemento [0]
            nombre = datos.get('nombre', ['Anónimo'])[0]
            mensaje = datos.get('mensaje', ['Sin mensaje'])[0]
            fecha = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # E. GUARDAMOS EN UN ARCHIVO LOCAL (Excel/CSV)
            # Esto se guarda en tu disco duro, NO en la base de datos de Firebase
            archivo_destino = 'buzon_local.csv'
            existe = os.path.exists(archivo_destino)
            
            try:
                with open(archivo_destino, 'a', newline='', encoding='utf-8') as f:
                    writer = csv.writer(f)
                    # Si es archivo nuevo, ponemos encabezados
                    if not existe:
                        writer.writerow(['FECHA', 'NOMBRE', 'MENSAJE'])
                    
                    # Escribimos los datos
                    writer.writerow([fecha, nombre, mensaje])
                
                print(f"Mensaje guardado localmente: {nombre}")
                
            except Exception as e:
                print(f"Error escribiendo archivo: {e}")

            # F. Respondemos al navegador con un HTML simple
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            
            respuesta_html = f"""
            <html>
                <body style="font-family: sans-serif; text-align: center; background-color: #f0f0f0; padding: 50px;">
                    <h1 style="color: green;">¡Guardado en el Disco Duro!</h1>
                    <p>Hola <strong>{nombre}</strong>, tu mensaje se guardó en 'buzon_local.csv'.</p>
                    <p>Esto NO afectó tu base de datos de Firebase.</p>
                    <br>
                    <a href="/contacto_local.html">Volver al formulario</a>
                </body>
            </html>
            """
            self.wfile.write(respuesta_html.encode('utf-8'))
        else:
            # Si intentan otra ruta POST que no conocemos
            self.send_error(404, "Ruta no configurada en Python")

# Arrancamos el servidor
print(f"--- SERVIDOR PYTHON PURO INICIADO ---")
print(f"Abriendo puerto {PORT}...")
print(f"Los datos se guardarán en: {os.path.abspath('buzon_local.csv')}")
print(f"Entra a: http://localhost:{PORT}/contacto_local.html")

with socketserver.TCPServer(("", PORT), ManejadorSeguro) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n--- Servidor detenido ---")