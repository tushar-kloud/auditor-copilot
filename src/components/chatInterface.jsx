import { useState, useEffect } from "react"
import ConversationWindow from "./chatInterfaceComponents/ConversationWindow"
import UserInputs from "./chatInterfaceComponents/userInputs.jsx"
import StarterSuggestions from "./chatInterfaceComponents/StarterSuggestions"
import { useDispatch, useSelector } from "react-redux"
import { setAction } from "../redux/actions/actionActions"
import { starterSuggestionsArray } from "../globalConstants/useCaseConstants"

export default function ChatInterface({setConversation, action}) {
  const [messages, setMessages] = useState(() => {
    const storedMessages = localStorage.getItem(`${action}-chatMessages`)
    return storedMessages ? JSON.parse(storedMessages) : []
  })

  // const [suggestionObject, setSuggestionObject] = useState()

  const {actionInfo} = useSelector((state) => state.actionState)
  // const { actionInfo } = actionState

  const dispatch = useDispatch()
  useEffect(() => {
    if(actionInfo){
      // const suggestions = starterSuggestionsArray.find(item => item.id === actionInfo);
      // setSuggestionObject(suggestions)
      // console.log('Suggestions Object: ', suggestionObject);
    }

    localStorage.setItem(`${action}-chatMessages`, JSON.stringify(messages))
    if(action){
      dispatch(setAction(action))
    }
    setConversation(messages)
  }, [messages])

  useEffect(() => {
  }, [messages, setMessages])
  return (
    messages.length > 0 ? (
      <div className="flex flex-col min-h-[78vh] h-auto">
        <div className="flex-1 h-full overflow-y-auto mb-1 space-top-4">
          <ConversationWindow messages={messages} setMessages={setMessages} />
          {/* <div className="flex-shrink-0"> */}
          {/* <UserInputs message={messages} setMessages={setMessages} /> */}
          {/* </div> */}
        </div>
        <div className="flex-shrink-0">
          <UserInputs message={messages} setMessages={setMessages} />
        </div>
      </div>
    ) : (
      <div className="flex flex-col min-h-[78vh] h-auto">
        <div className="flex-1 h-full overflow-y-auto mb-1 space-top-4">
          {/* {suggestionObject && ( */}
            <StarterSuggestions suggestionObjectId={action} message={messages} setMessages={setMessages} />
          {/* )} */}
        </div>
      </div>
    )

  )
}


{/* <StarterSuggestions message={messages} setMessages={setMessages} /> */ }