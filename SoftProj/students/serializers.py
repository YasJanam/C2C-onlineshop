from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User



class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = ['year', 'term', 'code', 'is_active']
        read_only_fields = ['code'] 

    
class StudentSemesterUnitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentSemester
        fields = ['min_units', 'max_units']

    def validate(self, data):
        
        min_u = data.get('min_units', self.instance.min_units)
        max_u = data.get('max_units', self.instance.max_units)

        if min_u > max_u:
            raise serializers.ValidationError(
                "min_units cannot be greater than max_units"
            )

        return data

    
"""
class StudentSemesterSerializer(serializers.ModelSerializer):
    semester = SemesterSerializer(read_only=False)
    class Meta:
        model = StudentSemester
        fields = [
            'student',
            'semester',
            'total_units',
            'min_units',
            'max_units',
        ]
"""
class StudentSemesterSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(write_only=True)
    semester_code = serializers.IntegerField(write_only=True)

    class Meta:
        model = StudentSemester
        fields = ['student_username', 'semester_code', 'total_units', 'min_units', 'max_units']

    def create(self, validated_data):
        student_username = validated_data.pop('student_username')
        semester_code = validated_data.pop('semester_code')

        student = User.objects.get(username=student_username)
        semester = Semester.objects.get(code=semester_code)

        ss = StudentSemester.objects.create(
            student=student,
            semester=semester,
            **validated_data
        )
        return ss

    def update(self, instance, validated_data):
        student_username = validated_data.pop('student_username', None)
        semester_code = validated_data.pop('semester_code', None)

        if student_username:
            instance.student = User.objects.get(username=student_username)
        if semester_code:
            instance.semester = Semester.objects.get(code=semester_code)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def to_representation(self, instance):
        return {
            "student": instance.student.username,
            "semester": instance.semester.code,
            "total_units": instance.total_units,
            "min_units": instance.min_units,
            "max_units": instance.max_units,
        }  

"""
class StudentCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentCourse
        fields = ['student_semester', 'course_offering', 'grade', 'status']
"""