from background_task import background
from django.core.files.storage import default_storage

@background()
def delete_qr_code_image(file_name):
    if default_storage.exists(file_name):
        default_storage.delete(file_name)
