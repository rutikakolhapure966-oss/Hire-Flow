from rest_framework import serializers
from django.contrib.auth import authenticate
from accounts.models import User, CandidateProfile, RecruiterProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'phone_number', 
                  'profile_picture', 'bio', 'location', 'website', 'linkedin_url', 
                  'github_url', 'is_verified', 'created_at']
        read_only_fields = ['id', 'created_at', 'is_verified']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=['candidate', 'recruiter'])
    
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'password_confirm', 'role']
    
    def validate(self, data):
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password'],
            role=validated_data['role'],
            username=validated_data['email']
        )
        
        if user.role == 'candidate':
            CandidateProfile.objects.create(user=user)
        elif user.role == 'recruiter':
            RecruiterProfile.objects.create(user=user)
        
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        data['user'] = user
        return data


class CandidateProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CandidateProfile
        fields = ['id', 'user', 'resume', 'skills', 'experience_years', 'current_title', 
                  'company', 'bio', 'portfolio_url', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class RecruiterProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = RecruiterProfile
        fields = ['id', 'user', 'company', 'department', 'designation', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
