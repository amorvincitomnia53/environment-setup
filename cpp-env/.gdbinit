python
import sys
import os
import getpass
user=getpass.getuser()
modulepath = os.path.dirname(os.path.realpath(os.getenv("HOME") + "/.gdbinit")) + "/eigen-gdb-printer"
print("<<Loading " + modulepath + ">>")
sys.path.insert(0, modulepath)
from printers import register_eigen_printers
register_eigen_printers (None)
end
