from rest_framework import serializers
from .models import Course , CourseOffering, Session
import re


class CourseSerializer(serializers.ModelSerializer):

    prerequisites = serializers.SlugRelatedField(
        queryset=Course.objects.all(),  
        slug_field="code",              
        many=True,
        required=False,     
        allow_empty=True , 
    )

    class Meta:
        model = Course
        fields = ['name', 'code', 'unit','prerequisites']


class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name', 'code', 'unit']  # بدون prerequisites

class CourseReadSerializer(serializers.ModelSerializer):
    prerequisites = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id','name', 'code', 'unit','prerequisites']  # بدون prerequisites

    def get_prerequisites(self, obj):
        return [{'id': p.id, 'name': p.name, 'code': p.code} for p in obj.prerequisites.all()]


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ["day_of_week", "time_slot", "location"]

class CourseOfferingWriteSerializer(serializers.ModelSerializer):
    # کاربر درس را از نوار بار انتخاب می‌کند، پس فقط code کافیست
    course_code = serializers.CharField(write_only=True)
    sessions = SessionSerializer(many=True, required=False)

    class Meta:
        model = CourseOffering
        fields = [
            'course_code',
            'group_code',
            'semester',
            'capacity',
            'prof_name',
            'sessions',
        ]

    def create(self, validated_data):
        # گرفتن course از کد
        course_code = validated_data.pop('course_code')
        sessions_data = validated_data.pop('sessions', [])

        try:
            course = Course.objects.get(code=course_code)
        except Course.DoesNotExist:
            raise serializers.ValidationError({"course_code": "Course not found"})

        # ساخت CourseOffering
        offering = CourseOffering.objects.create(course=course, **validated_data)

        # ساخت sessionها و اضافه کردن به m2m
        for session_data in sessions_data:
            session = Session.objects.create(**session_data)
            offering.sessions.add(session)

        return offering

    def update(self, instance, validated_data):
        # بروزرسانی course
        if 'course_code' in validated_data:
            course_code = validated_data.pop('course_code')
            try:
                instance.course = Course.objects.get(code=course_code)
            except Course.DoesNotExist:
                raise serializers.ValidationError({"course_code": "Course not found"})

        sessions_data = validated_data.pop('sessions', None)

        # بروزرسانی سایر فیلدها
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if sessions_data is not None:
            # پاک کردن sessionهای قبلی و ایجاد sessionهای جدید
            instance.sessions.all().delete()
            for session_data in sessions_data:
                session = Session.objects.create(**session_data)
                instance.sessions.add(session)

        return instance

"""
class CourseOfferingWriteSerializer(serializers.ModelSerializer):
    course_code = serializers.CharField(write_only=True)
    session_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Session.objects.all(),
        write_only=True,
        required=False
    )

    class Meta:
        model = CourseOffering
        fields = [
            'course_code',
            'group_code',
            'semester',
            'capacity',
            'prof_name',
            'session_ids',
        ]

    def create(self, validated_data):
        course_code = validated_data.pop('course_code')
        sessions = validated_data.pop('session_ids', [])

        try:
            course = Course.objects.get(code=course_code)
        except Course.DoesNotExist:
            raise serializers.ValidationError(
                {"course_code": "Course not found"}
            )

        offering = CourseOffering.objects.create(
            course=course,
            **validated_data
        )

        offering.sessions.set(sessions)
        return offering

    def update(self, instance, validated_data):
        if 'course_code' in validated_data:
            course_code = validated_data.pop('course_code')
            try:
                instance.course = Course.objects.get(code=course_code)
            except Course.DoesNotExist:
                raise serializers.ValidationError(
                    {"course_code": "Course not found"}
                )

        sessions = validated_data.pop('session_ids', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if sessions is not None:
            instance.sessions.set(sessions)

        return instance
"""
"""
class CourseOfferingReadSerializer(serializers.ModelSerializer):
    sessions = SessionSerializer(many=True, read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    course_unit = serializers.IntegerField(source='course.unit', read_only=True)

    class Meta:
        model = CourseOffering
        fields = [
            'code',
            'course_name',
            'course_code',
            'course_unit',
            'group_code',
            'semester',
            'capacity',
            'prof_name',
            'sessions',
        ]
"""
class CourseOfferingReadSerializer(serializers.ModelSerializer):
    sessions = SessionSerializer(many=True, read_only=True)
    course = CourseReadSerializer(read_only=True)  # ← اضافه شد

    class Meta:
        model = CourseOffering
        fields = [
            'code',
            'course',          # ← خود course را برمی‌گرداند
            'group_code',
            'semester',
            'capacity',
            'prof_name',
            'sessions',
        ]


# courses/serializers.py
from rest_framework import serializers
from courses.models import Course

class PrerequisiteSerializer(serializers.Serializer):
    coursecode = serializers.CharField(required=True)
    prereqcode = serializers.CharField(required=True)

    def validate(self, data):
        mode = self.context.get("mode")  
        course_code = data["coursecode"]
        prereq_code = data["prereqcode"]

        try:
            course = Course.objects.get(code=course_code)
        except Course.DoesNotExist:
            raise serializers.ValidationError({"coursecode": "Course with this code not found."})

        try:
            prereq = Course.objects.get(code=prereq_code)
        except Course.DoesNotExist:
            raise serializers.ValidationError({"prereqcode": "Course with this code not found."})

        if mode == "add":
            if course.id == prereq.id:
                raise serializers.ValidationError({"prereqcode": "A course cannot be prerequisite of itself."})
            if course.prerequisites.filter(id=prereq.id).exists():
                raise serializers.ValidationError({"prereqcode": "This prerequisite already exists."})

        elif mode == "remove":
            if not course.prerequisites.filter(id=prereq.id).exists():
                raise serializers.ValidationError({"prereqcode": "This prerequisite is not assigned to this course."})

        data["course"] = course
        data["prereq"] = prereq
        return data
