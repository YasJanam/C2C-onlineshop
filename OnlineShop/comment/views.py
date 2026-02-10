
from rest_framework.viewsets import ModelViewSet
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated , IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
# Create your views here.


class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Comment.objects.filter(is_deleted=False)

    @action(detail=True,methods=['delete'],url_path='delete')
    def delete_comment(self,request,pk=None):
        try:
            with transaction.atomic():
                comment = self.get_object()  
                comment.is_deleted = True
                comment.save()
                serializer = CommentSerializer(comment)
                return Response(serializer.data,status=status.HTTP_200_OK) 
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# used by user
class UserCommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = UserCommentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        comments = Comment.objects.filter(user=user,is_deleted=False)
        return comments
    

    @action(detail=True,methods=['delete'],url_path='delete')
    def delete_comment(self,request,pk=None):
        try:
            with transaction.atomic():
                comment = self.get_object()  
                comment.is_deleted = True
                comment.save()
                serializer = CommentSerializer(comment)
                return Response(serializer.data,status=status.HTTP_200_OK) 
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )