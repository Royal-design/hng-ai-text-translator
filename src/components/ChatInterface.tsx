import { summarizeText } from "@/ai/summarizeText";
import { translateText } from "@/ai/translateText";
import {
  setError,
  setSummarizeLoading,
  setSummary,
  setTranslatedText,
  setTranslateLoading
} from "@/redux/slice/chatSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { TextInput } from "./TextInput";
import { Message } from "./Message";
import { toast } from "sonner";
import { Navbar } from "./Navbar";
import { useEffect, useRef } from "react";

export const ChatInterface = () => {
  const dispatch = useAppDispatch();
  const { chats, activeChatId, selectedLang } = useAppSelector(
    (state) => state.chat
  );

  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const messages = activeChat ? activeChat.messages : [];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTranslate = async (id: number, text: string, lang: string) => {
    if (!activeChatId) return;

    dispatch(setTranslateLoading({ id, loading: true }));

    if (!selectedLang) {
      toast.warning("Please select the language");
      dispatch(setTranslateLoading({ id, loading: false }));
      return;
    }

    try {
      const translatedText = await translateText(text, lang, selectedLang);
      setTimeout(() => {
        dispatch(
          setTranslatedText({
            id,
            text: translatedText,
            translatedLang: selectedLang
          })
        );
      }, 200);
    } catch (err) {
      dispatch(setError("Translation failed."));
    } finally {
      dispatch(setTranslateLoading({ id, loading: false }));
    }
  };

  const handleSummarize = async (id: number, text: string) => {
    if (!activeChatId) return;

    dispatch(setSummarizeLoading({ id, loading: true }));

    try {
      const summary = await summarizeText(text);
      setTimeout(() => {
        dispatch(setSummary({ id, text: summary }));
      }, 200);
    } catch (err) {
      dispatch(setError("Summarization failed."));
    } finally {
      dispatch(setSummarizeLoading({ id, loading: false }));
    }
  };

  return (
    <div className="bg-background flex flex-col max-h-screen p-8 pb-2">
      <Navbar />
      <div className=" mt-8 overflow-auto flex flex-col gap-8 scrollbar-hidden h-screen w-full max-sm:px-2 px-[2rem]">
        {messages.length > 0 ? (
          <>
            {messages.map((msg) => (
              <Message
                key={msg.id}
                id={msg.id}
                text={msg.text}
                type={msg.type}
                lang={msg.lang}
                translatedLang={msg.translatedLang ?? ""}
                onTranslate={handleTranslate}
                onSummarize={handleSummarize}
                isSummarizing={msg.isSummarizing ?? false}
                isTranslating={msg.isTranslating ?? false}
                date={msg.timestamp}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <p className="text-center lg:text-4xl md:text-2xl max-sm:text-2xl  text-muted-foreground mt-10">
            What can I help you with?
          </p>
        )}
      </div>

      <TextInput scrollToBottom={scrollToBottom} />
    </div>
  );
};
