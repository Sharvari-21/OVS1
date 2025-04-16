from app import create_app

app = create_app()

@app.route('/')
def home():
    return "Backend is running!"

app.config['ENV'] = 'development'
app.config['DEBUG'] = True

if __name__ == '__main__':
    app.run(debug=True)
