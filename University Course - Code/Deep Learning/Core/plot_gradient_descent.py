import numpy as np
import plotly.graph_objects as go

def plot_animate_data(X, y, y_pred, title):
    """Animates the gradient descent optimization process.

    Parameters
    ----------
    X : numpy.ndarray
        The input data.
    y : numpy.ndarray
        The target data.
    y_pred : numpy.ndarray
        The predicted data.
    title : str
        The title of the plot.

    Returns
    -------
    None.

    """
    # Create the figure.
    fig = go.Figure()

    # Add the scatter plot.
    fig.add_trace(go.Scatter(x=X, y=y, mode='markers', name='Data'))

    # Add the line plot.
    fig.add_trace(go.Scatter(x=X, y=y_pred, mode='lines', name='Prediction'))

    # Add the title.
    fig.update_layout(title=title)

    # Add the animation.
    fig.update_layout(
        updatemenus=[
            dict(
                type="buttons",
                direction="left",
                buttons=list([
                    dict(
                        label="Play",
                        method="animate",
                        args=[
                            [None],
                            dict(frame=dict(duration=500, redraw=True),
                                 transition=dict(duration=0),
                                 fromcurrent=True,
                                 mode="immediate"
                                 )
                        ]
                    ),
                    dict(
                        label="Pause",
                        method="animate",
                        args=[
                            [None],
                            dict(frame=dict(duration=0, redraw=True),
                                 transition=dict(duration=0),
                                 mode="immediate"
                                 )
                        ]
                    )
                ]
                )
            )
        ]
    )

    # Plot the figure.
    fig.show()