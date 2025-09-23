
@file:kotlin.Suppress(
  "KotlinRedundantDiagnosticSuppress",
  "LocalVariableName",
  "MayBeConstant",
  "RedundantVisibilityModifier",
  "RemoveEmptyClassBody",
  "SpellCheckingInspection",
  "LocalVariableName",
  "unused",
)

package com.google.firebase.dataconnect.generated


import kotlinx.coroutines.flow.filterNotNull as _flow_filterNotNull
import kotlinx.coroutines.flow.map as _flow_map


public interface ListUserReviewsQuery :
    com.google.firebase.dataconnect.generated.GeneratedQuery<
      ExampleConnector,
      ListUserReviewsQuery.Data,
      Unit
    >
{
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val user: User?
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class User(
  
    val id: String,
    val username: String,
    val reviews: List<ReviewsItem>
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class ReviewsItem(
  
    val rating: Int?,
    val reviewDate: com.google.firebase.dataconnect.LocalDate,
    val reviewText: String?,
    val movie: Movie
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class Movie(
  
    val id: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
    val title: String
  ) {
    
    
  }
      
    
    
  }
      
    
    
  }
      
    
    
  }
  

  public companion object {
    public val operationName: String = "ListUserReviews"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Unit> =
      kotlinx.serialization.serializer()
  }
}

public fun ListUserReviewsQuery.ref(
  
): com.google.firebase.dataconnect.QueryRef<
    ListUserReviewsQuery.Data,
    Unit
  > =
  ref(
    
      Unit
    
  )

public suspend fun ListUserReviewsQuery.execute(
  
  ): com.google.firebase.dataconnect.QueryResult<
    ListUserReviewsQuery.Data,
    Unit
  > =
  ref(
    
  ).execute()


  public fun ListUserReviewsQuery.flow(
    
    ): kotlinx.coroutines.flow.Flow<ListUserReviewsQuery.Data> =
    ref(
        
      ).subscribe()
      .flow
      ._flow_map { querySubscriptionResult -> querySubscriptionResult.result.getOrNull() }
      ._flow_filterNotNull()
      ._flow_map { it.data }


// The lines below are used by the code generator to ensure that this file is deleted if it is no
// longer needed. Any files in this directory that contain the lines below will be deleted by the
// code generator if the file is no longer needed. If, for some reason, you do _not_ want the code
// generator to delete this file, then remove the line below (and this comment too, if you want).

// FIREBASE_DATA_CONNECT_GENERATED_FILE MARKER 42da5e14-69b3-401b-a9f1-e407bee89a78
// FIREBASE_DATA_CONNECT_GENERATED_FILE CONNECTOR example
