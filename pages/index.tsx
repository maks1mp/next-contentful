import Head from 'next/head'
import {GetStaticProps} from "next";
import Link from 'next/link';
import client from "../contentful";
import {IArticle, IArticleFields, IHome, IHomeFields} from "../contentful-types";
import {documentToReactComponents} from '@contentful/rich-text-react-renderer';
import {
    Card, Row, CardText, Col,
    CardTitle, Button, Container
} from 'reactstrap';


export default function Home(props: { title: string, homePage: IHome, articles: IArticle[] }) {
    return (
        <div>
            <Head>
                <title>{props.homePage.fields.title}</title>
            </Head>

            <main>
                <div
                    className="text-white text-center p-5"
                    style={{
                        background: `url("http:${props.homePage.fields.image?.fields.file.url}") no-repeat center / cover`,
                    }}>
                    <h1 className='mt-5'>{props.homePage.fields.title}</h1>
                    <div className='mb-5'>
                        {documentToReactComponents(props.homePage.fields.text!)}
                    </div>
                </div>

                <Container className="mt-5">
                    <Row>
                        {props.articles.map((article, index) => {
                            return (
                                <Col sm="4" key={index}>
                                    <Card body>
                                        <CardTitle tag="h5">{article.fields.title}</CardTitle>
                                        <CardText>
                                            {article.fields.description}
                                        </CardText>
                                        <Link href={`/articles/${article.fields.slug}`}>
                                            <Button>{article.fields.action}</Button>
                                        </Link>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
            </main>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const homePage = await client.getEntries<IHomeFields>({
        content_type: 'home',
        limit: 1
    });

    const articles = await client.getEntries<IArticleFields>({
        content_type: 'article'
    })

    const page = homePage.items[0];

    return {
        props: {
            homePage: page,
            articles: articles.items
        }
    }
}
