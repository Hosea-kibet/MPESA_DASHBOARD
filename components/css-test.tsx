export function CssTest() {
  return (
    <div className="p-4 m-4 bg-primary text-primary-foreground rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">CSS Test Component</h2>
      <p className="mt-2">
        If you can see this styled with a colored background and proper typography, your CSS is working!
      </p>
      <div className="mt-4 flex gap-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Blue Button</button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Green Button</button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Red Button</button>
      </div>
    </div>
  )
}
