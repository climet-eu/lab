# (C) Copyright 2022 ECMWF.
#
# This software is licensed under the terms of the Apache Licence Version 2.0
# which can be obtained at http://www.apache.org/licenses/LICENSE-2.0.
# In applying this licence, ECMWF does not waive the privileges and immunities
# granted to it by virtue of its status as an intergovernmental organisation
# nor does it submit to any jurisdiction.
#

import pyodide_http

pyodide_http.patch_all()

from . import codecs as _  # noqa
from .dataset import *  # noqa
from .metrics import *  # noqa
from .sigma import *  # noqa
from .suite import *  # noqa
from .turing import *  # noqa
from .utils import *  # noqa
