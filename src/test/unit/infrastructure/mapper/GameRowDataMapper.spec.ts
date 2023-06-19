import { GameRowDataMapper } from '$/infrastructure/mapper/GameRowDataMapper'
import { type GameRowData } from '$/infrastructure/row-data/GameRowData'
import chai from 'chai'

describe('GameRowData', () => {
  it('should map a row data to entity', () => {
    const rowData = {
      game_id: '8904dc7d-acc7-4106-9ff6-367090fe2e48',
      game_name: 'The Witcher 3: Wild Hunt - Complete Edition',
      game_description:
        'O jogo mais premiado de uma geração agora aprimorado para a atual! Experimente The Witcher 3: Wild Hunt e suas expansões nesta coleção definitiva, com melhor desempenho, visuais aprimorados, novo conteúdo adicional, modo fotografia e muito mais!',
      game_price: 100,
      releaseDate: '2020-05-14T00:00:00.000Z',
      age_rating_id: '4f7138f0-9181-424e-b240-f7ca66988c46',
      age: '12+',
      age_rating_description: 'Não recomendado para menores de 12 anos.',
      genre_ids: '98bd1a08-3d13-44ec-a448-f26dd23bde5b,fb24eb46-5aff-4850-b674-40711ae6d643',
      genre_names: 'genre_x,genre_y',
      platform_ids: 'd54e90d9-86f8-4c71-b029-f9f95b0d753c,ffe9a5eb-9804-4a97-94a8-63d072d03431',
      platform_names: 'platform_x,platform_y'
    }

    const gameMapped = GameRowDataMapper.toEntity(rowData as GameRowData)

    chai.expect(gameMapped.id).to.be.equal(rowData.game_id)
    chai.expect(gameMapped.getName()).to.be.equal(rowData.game_name)
    chai.expect(gameMapped.getDescription()).to.be.equal(rowData.game_description)
    chai.expect(gameMapped.getPrice()).to.be.equal(rowData.game_price)
    chai.expect(gameMapped.getReleaseDate().toISOString()).to.be.equal(new Date(rowData.releaseDate).toISOString())
    chai.expect(gameMapped.getAgeRating().id).to.be.equal(rowData.age_rating_id)
    chai.expect(gameMapped.getAgeRating().age).to.be.equal(rowData.age)
    chai.expect(gameMapped.getAgeRating().description).to.be.equal(rowData.age_rating_description)
    chai
      .expect([...gameMapped.getGenres()].map((x) => x.id))
      .to.be.deep.equal(['98bd1a08-3d13-44ec-a448-f26dd23bde5b', 'fb24eb46-5aff-4850-b674-40711ae6d643'])
    chai.expect([...gameMapped.getGenres()].map((x) => x.name)).to.be.deep.equal(['genre_x', 'genre_y'])
    chai
      .expect([...gameMapped.getPlatforms()].map((x) => x.id))
      .to.be.deep.equal(['d54e90d9-86f8-4c71-b029-f9f95b0d753c', 'ffe9a5eb-9804-4a97-94a8-63d072d03431'])
    chai.expect([...gameMapped.getPlatforms()].map((x) => x.getName())).to.be.deep.equal(['platform_x', 'platform_y'])
  })
})
