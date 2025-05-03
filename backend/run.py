import os
from app import create_app

app = create_app()

@app.route('/')
def home():
    return "Backend is running!"

# Set app configurations
app.config['ENV'] = 'production'
app.config['DEBUG'] = False

if __name__ == '__main__':
    # Get the port from the environment, default to 5000
    port = int(os.environ.get("PORT", 5000))
    # Run the app on 0.0.0.0 to make it externally accessible
    app.run(host='0.0.0.0', port=port)
