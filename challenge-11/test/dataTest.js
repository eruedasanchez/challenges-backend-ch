export const jwtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1NmRmZjU4YWVhMmE4YTQ1ZTRjNDcxNiIsImZpcnN0X25hbWUiOiJKdWxpYW4iLCJsYXN0X25hbWUiOiJMb3BleiIsImVtYWlsIjoiamxvcGV6QGdtYWlsLmNvbSIsImFnZSI6MjgsInBhc3N3b3JkIjoiJDJiJDEwJGRaYnJHRHJWZENid2lTajZSQ3dUWWVrckgvZGNwWktOTzB5cnV5cXlsaVhDWDYycXZTMGVxIiwiY2FydCI6IjY1NmRmZjU3YWVhMmE4YTQ1ZTRjNDcxNCIsInJvbGUiOiJwcmVtaXVtIiwiX192IjowfSwiaWF0IjoxNzAzMDMyNTEwLCJleHAiOjE3MDMwMzYxMTB9.tPJnW_7fKU2OhTOctyokqla8V1FJ5vry3SjYMQnJLlY';

export const productTestData = {
    PID_TWO: '656e82f9aecef67c8207a31e',
    PID_FIVE: '656e82d3aecef67c8207a314',
    PID_ADMIN:'656e5a832943f50a737deae9',
    PID_DELETE: '6582437526e81f7ba845cab2',
    INVALID_PID: 'hola',
    PRODUCT_PROPERTIES : [
        '_id', 
        'title', 
        'description', 
        'code', 
        'price', 
        'status', 
        'stock', 
        'category', 
        'thumbnails', 
        'owner', 
        '__v'
    ],
    POST_PRODUCT: {
        title: "Producto veinte",
        description: "Este es un producto prueba veinte",
        code: "abc123p20",
        price: 2020,
        status: true,
        stock: 320,
        category: "mesas",
        thumbnails: [
            "thumbnail-p20-1",
            "thumbnail-p20-2",
            "thumbnail-p20-3"
        ]
    },
    POST_PRODUCT_ADMIN: {
        title: "Producto dos modificado vadmin2",
        description: "Este es un producto prueba dos modificado vadmin2",
        code: "abc123p3vadmin2",
        price: 202,
        status: true,
        stock: 342,
        category: "muebles",
        thumbnails: [
            "thumbnail-p2-1",
            "thumbnail-p2-2",
            "thumbnail-p2-3"
        ]
    },
    POST_PRODUCT_EMPTY_DESCRIPTION: {
        title: "Producto veinte",
        description: "",
        code: "abc123p20",
        price: 2020,
        status: true,
        stock: 320,
        category: "mesas",
        thumbnails: [
            "thumbnail-p20-1",
            "thumbnail-p20-2",
            "thumbnail-p20-3"
        ]
    }
}

export const buildProductVersion = async (property, version) => {
    
    let productTest = {
        title: `Producto dos modificado v${parseInt(version)}`,
        description: `Este es un producto prueba dos modificado v${parseInt(version)}`,
        code: `abc123p3v${parseInt(version)}`,
        price: 2015,
        status: true,
        stock: 315,
        category: "muebles",
        thumbnails: [
            "thumbnail-p2-1",
            "thumbnail-p2-2",
            "thumbnail-p2-3"
        ]
    };
    
    if(property === 'title'){
        productTest = {
            title: `Producto dos modificado v${parseInt(version)}`,
            description: `Este es un producto prueba dos modificado v${parseInt(version)+1}`,
            code: `abc123p3v${parseInt(version)+1}`,
            price: 2015,
            status: true,
            stock: 315,
            category: "muebles",
            thumbnails: [
                "thumbnail-p2-1",
                "thumbnail-p2-2",
                "thumbnail-p2-3"
            ]
        };
    }

    if(property === 'description'){
        productTest = {
            title: `Producto dos modificado v${parseInt(version)+1}`,
            description: `Este es un producto prueba dos modificado v${parseInt(version)}`,
            code: `abc123p3v${parseInt(version)+1}`,
            price: 2015,
            status: true,
            stock: 315,
            category: "muebles",
            thumbnails: [
                "thumbnail-p2-1",
                "thumbnail-p2-2",
                "thumbnail-p2-3"
            ]
        };
    }

    if(property === 'code'){
        productTest = {
            title: `Producto dos modificado v${parseInt(version)+1}`,
            description: `Este es un producto prueba dos modificado v${parseInt(version)+1}`,
            code: `abc123p3v${parseInt(version)}`,
            price: 2015,
            status: true,
            stock: 315,
            category: "muebles",
            thumbnails: [
                "thumbnail-p2-1",
                "thumbnail-p2-2",
                "thumbnail-p2-3"
            ]
        };
    }    
    
    return productTest;
}


