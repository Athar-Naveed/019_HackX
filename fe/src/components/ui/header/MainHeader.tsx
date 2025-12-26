const MainHeader = ({state,page}:{state:boolean,page:string}) => {
    
    return (
        <>
        {/* Colorful header section */}
              <div className="mb-8 relative overflow-hidden rounded-xl bg-linear-to-r from-brand-600 to-brand-800 p-6">
                {/* Abstract shapes for visual interest */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-theme-purple-500 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-theme-purple-500 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
                <h1 className="text-2xl font-semibold text-white relative z-10">
                   {page}
                    
                </h1>
                <p className="mt-1 text-brand-100 relative z-10">
                    {page === "Organizations" ? 
                    state ? "Set up a new organization and start collaborating with your team"
                    :
                    "Join an existing organization using an invitation code"
                    :
                    page === "Inventory" ?
                  state
                  ? "Feed your hungry inventory"
                  : "If you have fed it well! Then there will be no empty spaces in your inventory."
                  : page === "Orders"
                  ?
                  state
                  ? "Time to sell some goods!"
                  : "Make sure to deliver your orders on time for happy customers."
                  : page === "Pockets" &&
                    "All your Pockets here"
                }
                
                </p>
              </div>
        </>
    )
}
export default MainHeader;