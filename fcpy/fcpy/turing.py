import html
import traceback
from copy import deepcopy
from typing import Any, Callable, Coroutine, Optional, Tuple, Union

import ipywidgets
import numpy as np
import xarray as xr
from IPython.display import display
from numcodecs.abc import Codec

from .suite import compress_decompress_dataset


def generate_turing_examples_iterative_knockout(
    ds: xr.Dataset,
    compressors: list[
        Union[Codec, list[Codec], dict[str, Union[Codec, list[Codec]]]]
    ],
    rng: np.random.Generator,
) -> Any:
    all_ds = [compress_decompress_dataset(ds, c) for c in compressors]

    comparison_counter = [0.0 for _ in compressors]
    accusation_counter = [0.0 for _ in compressors]

    ranked_compressors = []
    remaining_compressors = list(range(len(compressors)))

    while len(remaining_compressors) > 1:
        round_remaining_compressors = remaining_compressors[:]

        comparison_weight = 1

        while len(round_remaining_compressors) > 1:
            rng.shuffle(round_remaining_compressors)

            middle = len(round_remaining_compressors) // 2

            for i_a, i_b in [
                (
                    # random pairs of compressors
                    round_remaining_compressors[i],
                    round_remaining_compressors[middle + i],
                )
                for i in range(middle)
            ] + (
                [
                    (
                        # extra pair in case the number of compressors is odd
                        round_remaining_compressors[-1],
                        rng.choice(round_remaining_compressors[:-1]),
                    )
                ]
                if len(round_remaining_compressors) % 2 == 1
                else []
            ):
                ds_a = all_ds[i_a]
                ds_b = all_ds[i_b]

                # is 'a' a (worse) compressor?
                a_is_worse = yield ds_a, ds_b

                comparison_counter[i_a] += comparison_weight
                comparison_counter[i_b] += comparison_weight

                accusation_counter[
                    i_a if a_is_worse else i_b
                ] += comparison_weight

            # Collect the scores of all compressors remaining in this round
            round_compressor_scores = sorted(
                (
                    (i, accusation_counter[i] / comparison_counter[i])
                    for i in round_remaining_compressors
                ),
                key=lambda e: e[1],
                reverse=True,
            )

            if round_compressor_scores[0][1] == round_compressor_scores[-1][1]:
                # If all have the same score, do a tie-breaker round
                continue

            # Find a good split point to avoid splits between compressors with
            #  equivalent scores
            # new_middle will be the inclusive upper bound index of the
            #  compressor advancing to the next round
            new_middle = middle - 1
            middle_score = round_compressor_scores[new_middle][1]

            if middle_score == round_compressor_scores[-1][1]:
                # Shorten the next round since most compressors are good
                # Moves the split s.t. none of the good compressors are picked
                for new_middle in range(new_middle - 1, 0, -1):
                    if round_compressor_scores[new_middle][1] > middle_score:
                        break
            else:
                # Extend the next round to avoid a premature split
                for new_middle in range(
                    new_middle + 1, len(round_compressor_scores) - 1
                ):
                    if round_compressor_scores[new_middle][1] < middle_score:
                        new_middle -= 1
                        break

            # Downweigh further rounds as they only consider worse compressors
            comparison_weight *= (new_middle + 1) / len(
                round_remaining_compressors
            )

            round_remaining_compressors = [
                i for i, s in round_compressor_scores[: new_middle + 1]
            ]

        ranked_compressors.append(round_remaining_compressors[0])
        # Different from paper as we allow all unranked compressors back in
        remaining_compressors = list(
            set(remaining_compressors) - set(ranked_compressors)
        )

    ranked_compressors += remaining_compressors

    return ipywidgets.HTML(
        """
        <h3 style='text-align: center'>
            You have ranked the provided compression codecs as follows
            (from best to worst):
        </h3>
        <ol>
    """
        + "\n".join(
            f"<li>{html.escape(str(compressors[c]))}</li>"
            for c in ranked_compressors[::-1]
        )
        + """
        </ol>
    """
    )


def initiate_turing_test(
    ds: xr.Dataset,
    compressors: list[
        Union[Codec, list[Codec], dict[str, Union[Codec, list[Codec]]]]
    ],
    analysis: Callable[[xr.Dataset, np.random.Generator], None],
    example_generator: Callable[
        [
            xr.Dataset,
            list[
                Union[Codec, list[Codec], dict[str, Union[Codec, list[Codec]]]]
            ],
            np.random.Generator,
        ],
        Coroutine[Tuple[xr.Dataset, xr.Dataset], bool, Any],
    ] = generate_turing_examples_iterative_knockout,
    rng: Optional[np.random.Generator] = None,
) -> ipywidgets.DOMWidget:
    if rng is None:
        rng = np.random.default_rng(seed=None)

    header = ipywidgets.HTML("""
        <h2 style='text-align: center'>
            Data Compression Turing Test
        </h2>
        <h3 style='text-align: center'>
            Please compare the following two analysis outputs, variants A and B:
        </h3>
    """)

    start_button = ipywidgets.Button(
        description="Start",
        tooltip="Press this button to start the Turing Test for compression.",
        icon="play",
    )

    pre_placeholder = ipywidgets.VBox(
        [
            ipywidgets.HTML("""
            <h3 style='text-align: center; color: blue'>
                Waiting to start the analysis.
            </h3>
        """),
            ipywidgets.HBox(
                [start_button], layout={"justify_content": "center"}
            ),
        ]
    )
    wait_placeholder = ipywidgets.HTML("""
        <h3 style='text-align: center; color: red'>
            Performing the analysis ...
        </h3>
    """)
    post_placeholder = ipywidgets.HTML("""
        <h3 style='text-align: center; color: darkgreen'>
            Thank you for helping with the test!
        </h3>
    """)

    placeholder_a = ipywidgets.Output(layout={"width": "100%"})
    placeholder_b = ipywidgets.Output(layout={"width": "100%"})

    with placeholder_a:
        display(pre_placeholder)
    placeholder_a.clear_output(wait=True)
    with placeholder_b:
        display(pre_placeholder)
    placeholder_b.clear_output(wait=True)

    output_a = ipywidgets.Output()
    output_b = ipywidgets.Output()

    header_a = ipywidgets.HTML("<h3 style='text-align: center'>Variant A</h3>")
    header_b = ipywidgets.HTML("<h3 style='text-align: center'>Variant B</h3>")

    stack_a = ipywidgets.Stack([placeholder_a, output_a], selected_index=0)
    stack_b = ipywidgets.Stack([placeholder_b, output_b], selected_index=0)

    panel_a = ipywidgets.VBox(
        [header_a, stack_a],
        layout={"border": "1px solid black"},
    )
    panel_b = ipywidgets.VBox(
        [header_b, stack_b],
        layout={"border": "1px solid black"},
    )

    question = ipywidgets.HTML("""
        <h3 style='text-align: center'>
            Which one of these analysis outputs do you think was produced from
            (worse) compressed data?
        </h3>
    """)

    choice_a = "A is compressed"
    choice_b = "B is compressed"
    default_choice = "⟵ Choose ⟶"
    choice = ipywidgets.ToggleButtons(
        options=[choice_a, default_choice, choice_b],
        value=default_choice,
        disabled=True,
    )

    answer = ipywidgets.Output()

    footer = ipywidgets.VBox(
        [
            question,
            ipywidgets.HBox(
                [choice],
                layout={"justify_content": "center"},
            ),
        ],
    )

    def reset_outputs(complete=False):
        choice.disabled = True
        choice.value = default_choice

        with placeholder_a:
            display(post_placeholder if complete else wait_placeholder)
        placeholder_a.clear_output(wait=True)
        with placeholder_b:
            display(post_placeholder if complete else wait_placeholder)
        placeholder_b.clear_output(wait=True)

        stack_a.selected_index = 0
        stack_b.selected_index = 0

    def run_analysis(analysis, ds_a, ds_b):
        # FIXME: Switch to rng.spawn once numpy is updated to v1.25
        seed = rng.integers(2**31)

        rng_a = np.random.Generator(np.random.PCG64(seed=seed))
        rng_b = deepcopy(rng_a)

        with output_a:
            analysis(ds=ds_a, rng=rng_a)
        output_a.clear_output(wait=True)

        with output_b:
            analysis(ds=ds_b, rng=rng_b)
        output_b.clear_output(wait=True)

        stack_a.selected_index = 1
        stack_b.selected_index = 1

        choice.disabled = False

    app = ipywidgets.AppLayout(
        header=header,
        left_sidebar=panel_a,
        center=None,
        right_sidebar=panel_b,
        footer=footer,
        grid_gap="1em",
    )

    app_answer = ipywidgets.VBox([app, answer])

    example_generator = example_generator(ds, compressors, rng)

    def next_example(result=None):
        try:
            try:
                if result is None:
                    ds_a, ds_b = next(example_generator)
                else:
                    ds_a, ds_b = example_generator.send(result)
            except StopIteration as err:
                with answer:
                    display(err.value)

                return reset_outputs(complete=True)

            reset_outputs(complete=False)

            run_analysis(analysis, ds_a, ds_b)

            choice.observe(handle_choice, "value")
        except Exception as err:
            answer.append_stderr("".join(traceback.format_exception(err)))

    def handle_choice(change):
        choice.unobserve(handle_choice, "value")

        next_example(change.new == choice_a)

    start_button.on_click(lambda _: next_example())

    return app_answer
