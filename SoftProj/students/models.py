from django.db import models
from courses.models import CourseOffering
from django.contrib.auth.models import User


class Semester(models.Model):
    year = models.PositiveIntegerField(verbose_name="year",default=2025,blank=True,null=True)
    term = models.PositiveSmallIntegerField(
        verbose_name="term",
        help_text="1=First, 2=Second, 3=Summer",
        default=1,
        blank=True,
        null=True,
    )
    code = models.PositiveIntegerField(
        unique=True,
        editable=False,
        verbose_name="semester code"
    )
    is_active = models.BooleanField(default=False)

    class Meta:
        unique_together = ('year', 'term')

    def save(self, *args, **kwargs):
        self.code = self.year * 10 + self.term
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.code)


class StudentSemester(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    #student_code = models.CharField(default="none")
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    #semester_code = models.IntegerField(default=20251) 

    total_units = models.PositiveSmallIntegerField(default=0,blank=True,null=True)
 
    min_units = models.PositiveSmallIntegerField(default=12,blank=True,null=True)
    max_units = models.PositiveSmallIntegerField(default=24,blank=True,null=True)

    class Meta:
        unique_together = ('student', 'semester')

    def __str__(self):
        return f"{self.semester}" #{self.student} -
    


"""
class StudentCourse(models.Model):
    student_semester = models.ForeignKey(StudentSemester, on_delete=models.CASCADE)
    course_offering = models.ForeignKey(CourseOffering, on_delete=models.CASCADE)
    #student = models.ForeignKey(User,on_delete=models.CASCADE)

    grade = models.FloatField(null=True, blank=True)
    status = models.CharField(
        choices=[
            ('enrolled','Enrolled'),
            ('passed','Passed'),
            ('failed','Failed'),
            ('dropped','Dropped')
        ],
        default='enrolled'
    )
"""

