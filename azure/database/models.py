from peewee import *

# Todo:: move this to a config file
database = PostgresqlDatabase('lanten', **{'host': 'localhost', 'port': 5432, 'user': 'admin', 'password': 'admin'})

class UnknownField(object):
    def __init__(self, *_, **__): pass

class BaseModel(Model):
    class Meta:
        database = database

class User(BaseModel):
    created_at = DateTimeField(column_name='createdAt', constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    email = TextField(unique=True)
    id = TextField(primary_key=True)
    is_active = BooleanField(column_name='isActive', constraints=[SQL("DEFAULT true")])
    name = TextField(null=True)
    password = TextField()
    updated_at = DateTimeField(column_name='updatedAt')
    user_type = UnknownField(column_name='userType', constraints=[SQL("DEFAULT 'TENANT'::\"userType\"")])  # USER-DEFINED

    class Meta:
        table_name = 'User'

class Property(BaseModel):
    address = TextField()
    created_at = DateTimeField(column_name='createdAt', constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    description = TextField(null=True)
    id = TextField(primary_key=True)
    is_deleted = BooleanField(column_name='isDeleted', constraints=[SQL("DEFAULT false")])
    landlord = ForeignKeyField(column_name='landlordId', field='id', model=User)
    name = TextField()
    updated_at = DateTimeField(column_name='updatedAt')

    class Meta:
        table_name = 'Property'

class Lease(BaseModel):
    created_at = DateTimeField(column_name='createdAt', constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    description = TextField(null=True)
    end_date = DateTimeField(column_name='endDate')
    id = TextField(primary_key=True)
    invite_code = TextField(column_name='inviteCode')
    is_deleted = BooleanField(column_name='isDeleted', constraints=[SQL("DEFAULT false")])
    property = ForeignKeyField(column_name='propertyId', field='id', model=Property)
    start_date = DateTimeField(column_name='startDate')
    total_rent = DoubleField(column_name='totalRent', constraints=[SQL("DEFAULT 0")])
    updated_at = DateTimeField(column_name='updatedAt')

    class Meta:
        table_name = 'Lease'

class Announcement(BaseModel):
    created_at = DateTimeField(column_name='createdAt', constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    id = TextField(primary_key=True)
    is_deleted = BooleanField(column_name='isDeleted', constraints=[SQL("DEFAULT false")])
    lease = ForeignKeyField(column_name='leaseId', field='id', model=Lease, null=True)
    message = TextField()
    title = TextField()
    updated_at = DateTimeField(column_name='updatedAt')

    class Meta:
        table_name = 'Announcement'

class LeaseTenant(BaseModel):
    created_at = DateTimeField(column_name='createdAt', constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    id = TextField(primary_key=True)
    individual_rent = DoubleField(column_name='individualRent', constraints=[SQL("DEFAULT 0")])
    is_deleted = BooleanField(column_name='isDeleted', constraints=[SQL("DEFAULT false")])
    lease = ForeignKeyField(column_name='leaseId', field='id', model=Lease)
    tenant = ForeignKeyField(column_name='tenantId', field='id', model=User)
    updated_at = DateTimeField(column_name='updatedAt')

    class Meta:
        table_name = 'LeaseTenant'

class LeaseTenantInvite(BaseModel):
    created_at = DateTimeField(column_name='createdAt', constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    email = TextField()
    expires_at = DateTimeField(column_name='expiresAt')
    id = TextField(primary_key=True)
    invite_code = TextField(column_name='inviteCode')
    is_deleted = BooleanField(column_name='isDeleted', constraints=[SQL("DEFAULT false")])
    is_used = BooleanField(column_name='isUsed', constraints=[SQL("DEFAULT false")])
    lease = ForeignKeyField(column_name='leaseId', field='id', model=Lease, null=True)
    updated_at = DateTimeField(column_name='updatedAt')

    class Meta:
        table_name = 'LeaseTenantInvite'

class RequestType(BaseModel):
    created_at = DateTimeField(column_name='createdAt', constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    id = TextField(primary_key=True)
    name = TextField()
    updated_at = DateTimeField(column_name='updatedAt')

    class Meta:
        table_name = 'RequestType'

class MaintenanceRequest(BaseModel):
    created_at = DateTimeField(column_name='createdAt', constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    description = TextField()
    id = TextField(primary_key=True)
    is_deleted = BooleanField(column_name='isDeleted', constraints=[SQL("DEFAULT false")])
    lease = ForeignKeyField(column_name='leaseId', field='id', model=Lease)
    request_type = ForeignKeyField(column_name='requestTypeId', field='id', model=RequestType)
    status = UnknownField(constraints=[SQL("DEFAULT 'PENDING'::maintenanceRequestStatus'")])  # USER-DEFINED
    updated_at = DateTimeField(column_name='updatedAt')

    class Meta:
        table_name = 'MaintenanceRequest'

class Payment(BaseModel):
    amount = DoubleField()
    created_at = DateTimeField(column_name='createdAt', constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    description = TextField(null=True)
    id = TextField(primary_key=True)
    is_deleted = BooleanField(column_name='isDeleted', constraints=[SQL("DEFAULT false")])
    lease = ForeignKeyField(column_name='leaseId', field='id', model=Lease, null=True)
    lease_tenant = ForeignKeyField(column_name='leaseTenantId', field='id', model=LeaseTenant, null=True)
    name = TextField()
    payment_date = DateTimeField(column_name='paymentDate')
    recurring_interval = UnknownField(column_name='recurringInterval', constraints=[SQL("DEFAULT 'NONE'::recurringInterval'")])  # USER-DEFINED
    type = UnknownField(constraints=[SQL("DEFAULT 'OTHER'::paymentType'")])  # USER-DEFINED
    updated_at = DateTimeField(column_name='updatedAt')

    class Meta:
        table_name = 'Payment'

class Reminder(BaseModel):
    days_before = IntegerField(column_name='daysBefore')
    id = TextField(primary_key=True)
    payment = ForeignKeyField(column_name='paymentId', field='id', model=Payment)
    recurring = BooleanField(constraints=[SQL("DEFAULT false")])

    class Meta:
        table_name = 'Reminder'

class ReminderSent(BaseModel):
    id = TextField(primary_key=True)
    reminder = ForeignKeyField(column_name='reminderId', field='id', model=Reminder)
    sent_date = DateTimeField(column_name='sentDate')

    class Meta:
        table_name = 'ReminderSent'

class PrismaMigrations(BaseModel):
    applied_steps_count = IntegerField(constraints=[SQL("DEFAULT 0")])
    checksum = CharField()
    finished_at = DateTimeField(null=True)
    id = CharField(primary_key=True)
    logs = TextField(null=True)
    migration_name = CharField()
    rolled_back_at = DateTimeField(null=True)
    started_at = DateTimeField(constraints=[SQL("DEFAULT now()")])

    class Meta:
        table_name = '_prisma_migrations'

