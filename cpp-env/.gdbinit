python
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.realpath(__file__)) + "/eigen-gdb-printer")
from printers import register_eigen_printers
register_eigen_printers (None)
end
