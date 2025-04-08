import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }) => {
    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account);
    }

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="nav__brand">
                            <div className="flex items-center">
                                {/* Logo/Icon */}
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                
                                {/* Brand Name */}
                                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                                    AI NFT Generator
                                </h1>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center">
                        {account ? (
                            <div className="flex items-center">
                                {/* Connected indicator */}
                                <div className="hidden md:flex items-center mr-3">
                                    <div className="h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                                    <span className="text-sm text-gray-400">Connected</span>
                                </div>
                                
                                {/* Account display button */}
                                <button
                                    type="button"
                                    className="py-2 px-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 flex items-center hover:border-purple-500 transition-all duration-300 group"
                                >
                                    <span className="mr-2 text-purple-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <span className="font-medium">
                                        {account.slice(0, 6) + '...' + account.slice(38, 42)}
                                    </span>
                                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l4-4-4-4" />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="py-2 px-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-0.5 transition-all duration-300"
                                onClick={connectHandler}
                            >
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                                    </svg>
                                    Connect Wallet
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;