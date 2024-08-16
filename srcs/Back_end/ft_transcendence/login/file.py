import requests
from django.conf import settings
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth import login
from myapp.models import CustomUser  # Assuming you have a custom user model

def google_auth_redirect(request):
    # Step 1: Get the authorization code from the URL
    code = request.GET.get('code')
    
    if not code:
        return JsonResponse({"error": "Authorization code not provided"}, status=400)

    # Step 2: Exchange the authorization code for an access token
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    
    token_response = requests.post(token_url, data=data)
    token_data = token_response.json()
    
    if "error" in token_data:
        return JsonResponse({"error": "Failed to get access token"}, status=400)
    
    access_token = token_data['access_token']

    # Step 3: Use the access token to get user info from Google
    userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    headers = {"Authorization": f"Bearer {access_token}"}
    userinfo_response = requests.get(userinfo_url, headers=headers)
    userinfo = userinfo_response.json()
    
    if "error" in userinfo:
        return JsonResponse({"error": "Failed to fetch user info"}, status=400)

    google_id = userinfo['id']
    email = userinfo['email']
    name = userinfo.get('name')

    # Step 4: Authenticate or register the user
    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        # Register the user if they don't exist
        user = CustomUser.objects.create_user(
            username=email,  # You may use a different username field
            email=email,
            first_name=name.split()[0] if name else "",
            last_name=name.split()[1] if name else "",
            google_id=google_id,  # You may want to store the Google ID
        )
    
    # Authenticate the user
    login(request, user)
    
    # Step 5: Redirect the user or return a success response
    return redirect('home')  # Redirect to your app's home or dashboard

