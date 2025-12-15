"""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Course 
from .serializers import PrerequisiteSerializer

# POST add prerequisite by code in request
@api_view(["POST"])
def add_prerequisite_by_code(request):

    serializer = PrerequisiteSerializer(
        data=request.data,
        context={"mode": "add"}
    )
    serializer.is_valid(raise_exception=True)

    prereq = serializer.validated_data["prereq"]
    course = serializer.validated_data["course"]
    course.prerequisites.add(prereq)

    return Response({"message": "Prerequisite added"}, status=200)


# POST remove prerequisite by code in request
@api_view(["POST"])
def remove_prerequisite_by_code(request):

    serializer = PrerequisiteSerializer(
        data=request.data,
        context={"mode": "remove"}
    )
    serializer.is_valid(raise_exception=True)

    prereq = serializer.validated_data["prereq"]
    course = serializer.validated_data["course"]
    course.prerequisites.remove(prereq)

    return Response({"message": "Prerequisite removed"}, status=200)
"""