const controllerWrapper = controller => {
    const wrapper = async (request, response, next) => {
        try {
            await controller(request, response, next);
        } catch (error) {
            console.log(error)
            next(error);            
        }     
    }
    
    return wrapper;
}

module.exports = controllerWrapper;