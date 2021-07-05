'''
# Here I covered some of the most fundamental concepts of tensors using TensorFlow

More specifically:
* Intro to tensors
* Getting info about tensors
* Manipulating tensors
* Tensors & NumPy
* Using @tf.function (a way to speed up regular Python functions)
* using GPUs with TensorFlow
* Some Exercises

'''

''' # Intro to tensors '''
#%% Import TensorFlow
import tensorflow as tf
print(tf.__version__)

# %% Create tensors with tf.constant()
scalar = tf.constant(7)
scalar
# %% Check the ndims of a tensor
scalar.ndim
# %% Create a vector
vector = tf.constant([10, 10])
vector
# %% Check the ndims of a vector
vector.ndim
# %% Create a matrix
matrix = tf.constant([[1, 7],
                      [7, 10]])
matrix

# %% Check the ndims of a matrix
matrix.ndim
# %% Create another matrix
matrix1 = tf.constant([[10., 7.], 
                        [3., 2.],
                        [8., 9.]], dtype=tf.float16) # Specifying dtype
matrix1
# %% Check the ndims of a matrix1
matrix1.ndim
# %% Create a tensor
tensor = tf.constant([[[1, 2, 3],
                       [4, 5, 6]],
                      [[7, 8, 9],
                       [10, 11, 12]],
                      [[13, 14, 15],
                       [16, 17, 18]]])
tensor
# %% Check the ndims of tensor
tensor.ndim
# %% 
