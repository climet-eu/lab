# Online Laboratory for Climate Science and Meteorology

Welcome to the **Online Laboratory for Climate Science and Meteorology**!

If you are familiar with [JupyterLab](https://jupyter.org/), you should feel right at home with the user interface of this lab. You can use the JupyterLab interface at [/lab](/lab) and a REPL interface at [/repl](/repl).

In fact, this laboratory is built using [JupyterLite](https://jupyterlite.readthedocs.io/en/stable/), "a JupyterLab distribution that runs entirely in [your] browser" by leveraging WebAssembly. In other words, while you typically need to install JupyterLab on your own machine or connect to a server that executes your code, JupyterLite runs installation-free in your webbrowser and allows your code, data, and information to stay entirely on your machine. To run Python code within your browser, JupyterLite uses [Pyodide](https://pyodide.org/en/stable/), "a Python distribution for the browser [...] based on WebAssembly".

While Pyodide already supports an extensive list of scientific Python packages, which we have contributed to, this laboratory comes with additional packages that are commonly used in the weather and climate science community, including (but not limited to) `metpy`, `cfgrib`, `earthkit`, and `xeofs`.


## Getting Started

To get started, click the blue `+` button in the top left to open a new launcher and create a new Python notebook from there. After the Python kernel has initialised, you can execute Python code in the cells of the notebook.

> [!TIP]
> While many Python packages can be `import`ed directly, additional pure Python packages can also be loaded by executing the `%pip install <PACKAGE>` magic inside a cell, after which the package can be imported.

> [!NOTE]
> The online laboratory has only been tested in recent Firefox and Chrome browsers. Some features may not (yet) be supported in Safari browsers.

> [!CAUTION]
> Any changes you make to this notebook will be lost once the page is closed or refreshed. Please download any files you would like to keep.


## Getting Help and Contributing

This laboratory is being developed at https://github.com/climet-eu/lab. If you come across a bug or would like to suggest a new feature or support for an additional Python package, please submit an issue at https://github.com/climet-eu/lab/issues/.


## License

Licensed under the Mozilla Public License, Version 2.0 ([LICENSE](LICENSE) or https://www.mozilla.org/en-US/MPL/2.0/).


## Funding

The Online Laboratory for Climate Science and Meteorology has been developed as part of [ESiWACE3](https://www.esiwace.eu), the third phase of the Centre of Excellence in Simulation of Weather and Climate in Europe.
