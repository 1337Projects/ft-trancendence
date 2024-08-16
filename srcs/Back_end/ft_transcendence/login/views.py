from django.shortcuts import render,redirect
from django.contrib.auth import logout
from django.http import JsonResponse
from django.conf import settings
import urllib.parse

# Create your views here.



def google_oauth(request):
    if request.method == 'GET':
        # Define the Google OAuth 2.0 endpoint
        google_oauth_endpoint = "https://accounts.google.com/o/oauth2/auth"

        # Client ID and Redirect URI from Google Developer Console
        client_id = "1063752047067-68ak54eimd9bkcorgsvmp918vk85e57c.apps.googleusercontent.com"
        redirect_uri = "http://localhost:5173/"  # This is where Google will redirect after authentication
        response_type = "code"  # We're using the authorization code flow
        scope = "openid email profile"  # Define the scopes you want
        state = "random_state_string"  # Optional: helps protect against CSRF attacks

        # Construct the full URL for the authorization request
        params = {
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "response_type": response_type,
            "scope": scope,
            "state": state,
            "access_type": "offline",  # Optional: to get a refresh token
        }
        
        # Build the query string
        oauth_url = f"{google_oauth_endpoint}?{urllib.parse.urlencode(params)}"

        # Return the URL to the frontend
        return JsonResponse({"url": oauth_url})
    elif request.method == 'POST' :
        return JsonResponse({"code": request.POST.get("code")})

