from flask import Flask, render_template, request, redirect
import datetime
import pytz # timezone 
import requests
import os



app = Flask(__name__)


@app.route('/', methods=['GET'])
def home_page():
	return render_template('index.html')

@app.route('/<name>')
def profile(name):
	return render_template('index.html', name=name)   

@app.route('/python_apps')
def python_apps_page():
	# testing stuff
	return render_template('python_apps.html')

if __name__ == '__main__':
	app.run(debug=True)