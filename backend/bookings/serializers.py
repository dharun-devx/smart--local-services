from rest_framework import serializers

from .models import Booking
from users.models import UserProfile


class BookingSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(write_only=True, required=True)

    class Meta:
        model = Booking

        fields = [
            "id",
            "user",
            "service",
            "name",
            "email",
            "phone",
            "address",
            "service_date",
            "service_time",
            "description",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        service = attrs.get("service")
        service_date = attrs.get("service_date")
        service_time = attrs.get("service_time")

        # Same service + same date + same time
        # already booked or not
        if service and service_date and service_time:
            existing_booking = Booking.objects.filter(
                service=service,
                service_date=service_date,
                service_time=service_time
            ).exists()

            if existing_booking:
                raise serializers.ValidationError({
                    "non_field_errors": [
                        "This service is already booked for the selected date and time."
                    ]
                })

        return attrs

    def create(self, validated_data):

        email = validated_data.pop("email").strip().lower()
        name = validated_data.get("name")
        phone = validated_data.get("phone")

        # Find existing user by email
        user = UserProfile.objects.filter(email__iexact=email).first()

        # If user does not exist, automatically create user
        if user is None:
            user = UserProfile.objects.create(
                name=name,
                email=email,
                phone=phone,
                password=""
            )

        # If user already exists, update latest phone/name
        else:
            user.name = name
            user.phone = phone
            user.save(update_fields=["name", "phone", "updated_at"])

        # Connect booking with the user
        validated_data["user"] = user

        return Booking.objects.create(**validated_data)