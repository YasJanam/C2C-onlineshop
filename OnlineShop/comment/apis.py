
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Comment
from .serializers import CommentSerializer

class ProductCommentsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self,requset,product_id):
        comments = Comment.objects.filter(product__id = product_id)
        data = CommentSerializer(comments,many=True)
        return Response(data.data)