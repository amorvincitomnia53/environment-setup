python
import sys
import os
print("<<Loading " + os.path.dirname(os.path.realpath(".gdbinit")) + "/eigen-gdb-printer>>")
sys.path.insert(0, os.path.dirname(os.path.realpath(".gdbinit")) + "/eigen-gdb-printer")
from printers import register_eigen_printers
register_eigen_printers (None)
end
