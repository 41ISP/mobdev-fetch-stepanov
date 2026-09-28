import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Loader from "../components/Loader"

const Book = () => {
    const {id} = useParams ()

    const [book, setBook] = useState([])
        const [isLoading, setIsLoading] = useState(false)
        const [error , setError] = useState(null)
    
     useEffect(() => {
            const loadBook = async () => {
            try{
                setIsLoading(true)
                const res = await fetch(`https://openlibrary.org/works/${id}.json`) 
    
                if (!res.ok){
               const data = await res.json()
                 throw new Error(data.detail[0].msg||"Что-то не так хыхыхыхыххы")
                 }
                const data = await res.json()
                if (data.authors) {
                const authorRes = await fetch(`https://openlibrary.org${data.authors[0].author.key}.json`)
               const authorData = await authorRes.json()
               if (res.ok) data.author = authorData.name
                }
               if (data.genres) {
                const genresRes = await fetch(`https://openlibrary.org${data.genres[0]}.json`)
               const genresData = await genresRes.json()
               if (res.ok) data.genres = genresData.name
                }
                setBook(data)
            } catch(error) {
                console.error(error)
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
            }
            loadBook()
        }, [])
        if(isLoading) return <Loader/>
        if (!isLoading && error) return <p> {error}</p>
        if (book) return (
        <section className="book-page">
            <div className="book-page-cover">
                <img
                    id="bookCover"
                    src="https://covers.openlibrary.org/b/id/${book.covers[0]-L.jpg}"
                    alt="{book.title}"
                />
            </div>
            <div className="book-page-content">
                <div className="section-label">КНИГА</div>
                <h1 id="bookTitle">{book.title}</h1>
                {book.author}
                <div className="book-page-author" id="bookAuthor">
                  
                </div>
                {book.genres &&
                <div className="book-meta">
                    {book.first_publish_date && (
                    <span id="bookYear">{book.first_publish_date}</span>
                    )}
                    <span>{book.genres}</span>
                </div>}
                {book.description &&
                <div className="description">
                    <h3>Об этой книге</h3>
                    <p id="bookDescription"> {book.description.value}</p>
                </div>}
                <div className="modal-actions">
                    <button className="primary-button">Читать</button>
                    <button className="secondary-button">♡ Сохранить</button>
                </div>
            </div>
        </section>
    )
}

export default Book
