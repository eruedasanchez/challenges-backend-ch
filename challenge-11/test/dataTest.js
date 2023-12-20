export const jwtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1ODM2ODkwZDg2NGE1ZDhkMmJmNzdiZSIsImZpcnN0X25hbWUiOiJKdWFuIiwibGFzdF9uYW1lIjoiU2F0aXNmYWN0b3JpYSIsImVtYWlsIjoianVhbi5zYXRpc2ZhY3RvcmlhQGdtYWlsLmNvbSIsImFnZSI6MjUsInBhc3N3b3JkIjoiJDJiJDEwJGlRQmcwMDFPVWd0R0ZDblFUZ2NXaXUvVDROb2dKRDcvMUFmLlFGYTdsNVNyWjJ4QlgxU082IiwiY2FydCI6IjY1ODM2ODkwZDg2NGE1ZDhkMmJmNzdiYyIsInJvbGUiOiJ1c2VyIiwiX192IjowfSwiaWF0IjoxNzAzMTEzODI2LCJleHAiOjE3MDMxMTc0MjZ9.9KZGtY81JxMbeJnU3diiRn_Um75aTe-ilV7hiPudGmM';

export const productTestData = {
    PID_TWO: '656e82f9aecef67c8207a31e',
    PID_FIVE: '656e82d3aecef67c8207a314',
    PID_EIGHT: '6582ff09679223d1fed21650',
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

export const cartTestData = {
    CID_JLOPEZ: '656dff57aea2a8a45e4c4714',
    CID_ERUEDA: '656df5b5f045035c7d4dd8ab',
    CID_JSATISFACTORIA: '65836890d864a5d8d2bf77bc',
    CID_RINSATISFACTORIA: '65836e3288221564b513657f'
}


