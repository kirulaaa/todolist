require("./server");

exports.handler = async() => {
    return {
        statusCode: 200,
        body: "Lambda Web Adapter is active"
    };
}