from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import URL
from .forms import EditUrl
from django.urls import reverse_lazy
import json

@ensure_csrf_cookie
def home(request):
    context = {}
    if request.user.is_authenticated:
        context['user_urls'] = URL.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'shortener/home.html', context)

def create_short_url(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            original_url = data.get('url')
            password = data.get('password')
            
            if not original_url:
                return JsonResponse({'error': 'URL is required'}, status=400)
            
            # Create new URL object
            url_obj = URL.objects.create(
                original_url=original_url,
                user=request.user if request.user.is_authenticated else None
            )
            
            if password:
                url_obj.set_password(password)
                url_obj.save()
            
            return JsonResponse({
                'short_url': request.build_absolute_uri(f'/{url_obj.short_url}'),
                'original_url': url_obj.original_url,
                'is_password_protected': url_obj.is_password_protected
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def check_password(request, short_url):
    if request.method == 'POST':
        url_obj = get_object_or_404(URL, short_url=short_url)
        password = request.POST.get('password')
        
        if url_obj.check_password(password):
            request.session[f'url_access_{short_url}'] = True
            return redirect(url_obj.original_url)
        
        return render(request, 'shortener/password_required.html', {'error': 'Invalid password'})
    
    return render(request, 'shortener/password_required.html')

def redirect_to_original(request, short_url):
    url_obj = get_object_or_404(URL, short_url=short_url)
    
    # Check if URL is password protected
    if url_obj.is_password_protected:
        # Allow access if user is the owner
        if request.user.is_authenticated and url_obj.user == request.user:
            pass
        # Check if password was previously verified in this session
        elif not request.session.get(f'url_access_{short_url}'):
            return redirect(reverse_lazy('shortener:check_password', kwargs={'short_url': short_url})) 
    
    url_obj.clicks += 1
    url_obj.save()
    return redirect(url_obj.original_url)

@login_required
def modify_request(request, pk):
    url = get_object_or_404(URL, id=pk)
    if request.user == url.user:
        url_form = {
            'original_url': url.original_url,
            'short_url': url.short_url,
        }
        other_fields = ['original_url', 'password', 'newpassword1', 'newpassword2', 'unsetpassword']
        for item in other_fields:
            item_value = request.POST.get(item, None)
            if item_value:
                url_form[item] = item_value

        form = EditUrl(url_form)
        if request.method == 'POST':
            if request.POST.get('cancel', None):
                messages.error(request, f'deletion of url id {url.id} canceled')
            elif request.POST.get('delete', None):
                if url.check_password(url_form.get('password', None)) or (not url.is_password_protected):
                    url_id = url.id
                    url.delete()
                    messages.success(request, f'url id {url_id} deleted successfully')
                else:
                    messages.error(request, f'Enter correct password')
                    return redirect(reverse_lazy('shortener:modify_request', kwargs={'pk': url.id}))
            elif request.POST.get('edit', None):
                if url.check_password(url_form.get('password', None)) or (not url.is_password_protected):
                    if url_form.get('original_url', None) and url.original_url != url_form['original_url']:
                        url.original_url = url_form['original_url'].strip()
                        messages.success(request, f'Url of {url.id} changed')
                    if url_form.get('newpassword1', None) and url_form.get('newpassword2', None) and (url_form['newpassword1'] == url_form['newpassword2']) and (not url.check_password(url_form['newpassword1'])):
                        url.set_password(url_form['newpassword1'])
                        messages.success(request, f'Password of {url.id} changed')
                    elif url_form.get('unsetpassword', None):
                        url.is_password_protected = False
                        url.password = ''
                        messages.success(request, f'Password of {url.id} removed')
                    url.save()
                else:
                    messages.error(request, f'Password of {url.id} incorrect')
                
            return redirect(reverse_lazy('shortener:home'))
        else:
            context = {'url': url, 'form': form}
            return render(request, 'shortener/confirm_modification.html', context)
    else:
        return HttpResponse('Get lost chump')