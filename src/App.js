import { useState, useEffect } from 'react';
import { NFTStorage, File } from 'nft.storage'
import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import axios from 'axios';

// Components
import Spinner from 'react-bootstrap/Spinner';
import Navigation from './components/Navigation';

// ABIs
import NFT from './abis/NFT.json'

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [url, setURL] = useState(null)

  const [message, setMessage] = useState("")
  const [isWaiting, setIsWaiting] = useState(false)

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()

    const nft = new ethers.Contract(config[network.chainId].nft.address, NFT, provider)
    setNFT(nft)
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (name === "" || description === "") {
      window.alert("Please provide a name and description")
      return
    }

    setIsWaiting(true)

    // Call AI API to generate a image based on description
    const imageData = await createImage()

    // Upload image to IPFS (NFT.Storage)
    // const url = await uploadImage(imageData)

    // Mint NFT
    // await mintImage(url)

    setIsWaiting(false)
    setMessage("")
  }

  const createImage = async () => {
    setMessage("Generating Image...")

    // You can replace this with different model API's
    // const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`
    const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large`

    // Send the request
    const response = await axios({
      url: URL,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        inputs: description, options: { wait_for_model: true },
      }),
      responseType: 'arraybuffer',
    })

    const type = response.headers['content-type']
    const data = response.data

    const base64data = Buffer.from(data).toString('base64')
    const img = `data:${type};base64,` + base64data // <-- This is so we can render it on the page
    setImage(img)

    return data
  }

  // const uploadImage = async (imageData) => {
  //   setMessage("Uploading Image...")

  //   // Create instance to NFT.Storage
  //   const nftstorage = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_API_KEY })

  //   // Send request to store image
  //   const { ipnft } = await nftstorage.store({
  //     image: new File([imageData], "image.jpeg", { type: "image/jpeg" }),
  //     name: name,
  //     description: description,
  //   })

  //   // Save the URL
  //   const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`
  //   setURL(url)

  //   return url
  // }

  const mintImage = async (tokenURI) => {
    setMessage("Waiting for Mint...")

    const signer = await provider.getSigner()
    const transaction = await nft.connect(signer).mint(tokenURI, { value: ethers.utils.parseUnits("0.00000000001", "ether") })
    await transaction.wait()
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navigation account={account} setAccount={setAccount} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">AI-Powered NFT Creator</h1>
            <p className="text-gray-400">Generate unique artwork with AI and mint it as an NFT</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Create Your NFT</h2>
              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">NFT Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter a creative name..." 
                    onChange={(e) => { setName(e.target.value) }}
                    className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea 
                    placeholder="Describe the image you want to create..." 
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition h-32"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center"
                  disabled={isWaiting}
                >
                  {isWaiting ? (
                    <>
                      <Spinner animation="border" size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Generate & Mint NFT"
                  )}
                </button>
              </form>
              
              {!isWaiting && url && (
                <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                  <p className="text-sm">
                    NFT Created! View <a href={url} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">Metadata</a>
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Preview</h2>
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                {!isWaiting && image ? (
                  <img src={image} alt="AI generated NFT" className="w-full h-full object-cover" />
                ) : isWaiting ? (
                  <div className="text-center py-16">
                    <Spinner animation="border" className="mb-4" />
                    <p className="text-gray-400">{message}</p>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-gray-400">Your NFT preview will appear here</p>
                  </div>
                )}
              </div>
              
              {!isWaiting && image && (
                <div className="mt-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium">{name || "Untitled NFT"}</h3>
                      <p className="text-sm text-gray-400 truncate">{description}</p>
                    </div>
                    <div className="bg-purple-600 text-xs font-bold px-2 py-1 rounded">AI Generated</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-12 text-center text-gray-400 text-sm">
            <p>Powered by Stable Diffusion & Ethereum</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;