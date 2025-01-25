from django.shortcuts import render
import requests
import sys, os
from rest_framework.decorators import api_view
from django.http import JsonResponse

@api_view(['GET'])
def get_all_emojis(request):
    api =  os.environ.get('EMOJIES_API')
    key = os.environ.get('EMOJIES_KEY')
    try:
        categorie = request.query_params['categorie']
        url = f"{api}categories/{categorie}?{key}"
        response = requests.get(url)
        if response.status_code == 200:
            emojis_data = response.json()
            if not emojis_data:
                emojis_data = []
            return JsonResponse({"data" : emojis_data}, status=200)
        return JsonResponse({"error" : "Failed to fetch emojis."}, status=401)
    except:
        return JsonResponse({"error" : "somthing went wrong"}, status=401)



@api_view(['GET'])
def search_in_emojies(request):
    api =  os.environ.get('EMOJIES_API')
    key = os.environ.get('EMOJIES_KEY')
    try:
        query = request.query_params['query']
        url = f"{api}emojis?search={query}&{key}"
        response = requests.get(url)
        if response.status_code == 200:
            emojis_data = response.json()
            if isinstance(emojis_data, dict):
                status = emojis_data.get("status", None) 
                if status and status == 'error':
                    emojis_data = []
            return JsonResponse({"data" : emojis_data}, status=200)
        return JsonResponse({"error" : "Failed to fetch emojis."}, status=401)
    except Exception as e:
        return JsonResponse({"error" : f"somthing went wrong - {e}"}, status=401)