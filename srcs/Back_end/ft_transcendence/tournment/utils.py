import sys

from datetime import datetime

# Print the current time with microseconds

def debug(msg):
        current_time = datetime.now()
        print(f'{ msg } - { current_time.strftime("%M:%S.%f") }')
        sys.stdout.flush()