# Lab 6: A CRUD API + Website for a "products" resource
Built in collaboration with Frida Gutierrez (@fridagtt)

## Description
In this assignment you are asked to create a basic CRUD API for handling the resource "products" belonging to our early shopping cart web app. 
Additionally, the website to interact with this API is needed.

This means you must create the routes for Cread, Read, Update, and Delete products using Express and NodeJS. Also you will need to create the views (web pages) to interact with the API.

## The products collection:

The products collection must have at least the following attributes:

Name, Required
Price, Required, no negative values
Brand, Optional
You can add more attributes for the resource.

## Endpoints:

For all CRUD operations. The Read should be implemented also in an “all” fashion, that is, to get all
products.
 
## Views:

Regarding the views, we need pages to visualize all the products, insert a product, and edit a product. If you want, you can create one to delete a product, or you can do it directly from the list-all-products page.

For the views you must load the data using Ajax requests (using Axios is recommended).

You can get some inspiration from the session 18 and associated snippets.

Use bootstrap and further libraries to customize the Look And Feel of your website.