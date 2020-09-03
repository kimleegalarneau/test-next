import Prof from "../components/prof";

// on peut auss importer du CSS avec React
import styles from "../styles/Profs.module.css";

import { PrismicLink } from "apollo-link-prismic";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import gql from "graphql-tag";

const client = new ApolloClient({
  link: PrismicLink({
    uri: "https://tim-nextjs-test.cdn.prismic.io/graphql",
  }),
  cache: new InMemoryCache(),
});

export default function Profs({ listeProfs }) {

  const donnees = listeProfs.edges;

  console.log(donnees)

  //avec React , on utilise la méthode .map() pour faire des loops
  // ici , je fais un loop pour chaque professeur dans la requête AJAX.
  // Pour chaque professeur, je crée un composant 'prof',
  // et je lui passe des attributs que j'ai défini dans le fichier de ce composant
  return (
    <div>
      <h1>Voici la liste des professeurs</h1>
       {
        donnees.map((prof, index) => {

        return (<Prof key={index} prof={prof} styles={styles}></Prof>)

        })
       }
    </div>
  );
}

//pour avoir la génération statique et avoir un maximum de SEO, on doit faire nos requêtes AJAX
//dans une fonction getStaticProps(), sinon ca ne fonctionne pas
//voici un exemple
export async function getServerSideProps(context) {

  const res = await client.query({
    query: gql`{
    allProfesseurs {
      edges {
        node {
          nom
          description
          photo
          _linkType
          biographie
        }
      }
    }
       }     `,
  });

  const listeProfs = await res.data.allProfesseurs;

  return {
    props: {
      listeProfs,
    },

    revalidate: 1,
  };
}
