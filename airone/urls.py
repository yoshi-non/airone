from django.conf import settings
from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import RedirectView
from django.contrib.auth import views as auth_views
from . import views

from api_v1.urls import urlpatterns as api_v1_urlpatterns

urlpatterns = [
    url('^$', views.index, name='index'),
    url(r'^$', RedirectView.as_view(url='dashboard/')),
    url(r'^acl/', include('acl.urls', namespace='acl')),
    url(r'^user/', include('user.urls', namespace='user')),
    url(r'^group/', include('group.urls', namespace='group')),
    url(r'^entity/', include('entity.urls', namespace='entity')),
    url(r'^dashboard/', include('dashboard.urls', namespace='dashboard')),
    url(r'^entry/', include('entry.urls', namespace='entry')),
    url(r'^admin/', admin.site.urls),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/v1/', include(api_v1_urlpatterns)),
    url(r'^job/', include('job.urls', namespace='job')),
    url(r'^login/', auth_views.LoginView.as_view(), name='login'),
    url(r'^logout/', auth_views.LogoutView.as_view(), name='logout'),
    url(r'^oauth/', include('social_django.urls', namespace='social')),
    url(r'^accounts/profile/', views.index, name='index'),
]

for extension in settings.AIRONE['EXTENSIONS']:
    urlpatterns.append(url(r'^extension/%s' % extension,
                           include('%s.urls' % extension, namespace=extension)))
