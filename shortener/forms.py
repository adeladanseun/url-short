from django import forms 
from .models import URL

class EditUrl(forms.ModelForm):
    newpassword1 = forms.CharField(max_length=50, help_text='New Password', widget=forms.PasswordInput, required=False)
    newpassword2 = forms.CharField(max_length=50, widget=forms.PasswordInput, required=False)
    password = forms.CharField(widget=forms.PasswordInput, max_length=50)
    class Meta:
        model = URL
        fields = ('short_url', 'original_url', 'password')
        widgets = {
            'short_url': forms.TextInput(attrs={'disabled': 'disabled'})
        }